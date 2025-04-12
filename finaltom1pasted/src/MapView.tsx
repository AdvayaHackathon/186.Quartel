import { useEffect, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const categories = [
  { name: 'Adventure', query: 'adventure park', color: '#FF6B6B' },
  { name: 'Nature and Wildlife', query: 'park', color: '#4CAF50' },
  { name: 'Museums', query: 'museum', color: '#9C27B0' },
  { name: 'Art Galleries', query: 'art gallery', color: '#FF9800' },
  { name: 'Local Cuisines', query: 'restaurant', color: '#E91E63' },
  { name: 'Historical Places', query: 'historical monument', color: '#795548' },
  { name: 'Temples', query: 'temple', color: '#FFC107' }
];

const MapView = () => {
  const [map, setMap] = useState<tt.Map | null>(null);
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [markersByQuery, setMarkersByQuery] = useState<{ [key: string]: tt.Marker[] }>({});

  // Initialize map
  useEffect(() => {
    const newMap = tt.map({
      key: 'VYQttWPbFY4nVHGVQ3OtqYyox20riwIo',
      container: 'map',
      center: [77.5946, 12.9716],
      zoom: 12
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, []);

  // Clear markers for a specific query
  const clearMarkersForQuery = (query: string) => {
    if (markersByQuery[query]) {
      markersByQuery[query].forEach(marker => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      const newMarkers = { ...markersByQuery };
      delete newMarkers[query];
      setMarkersByQuery(newMarkers);
    }
  };

  // Handle tag selection
  const handleTagClick = (query: string) => {
    setSelectedQueries(prev => {
      const newQueries = prev.includes(query) 
        ? prev.filter(q => q !== query)
        : [...prev, query];
      
      if (!newQueries.includes(query)) {
        clearMarkersForQuery(query);
      }
      
      return newQueries;
    });
  };

  // Fetch and display POIs
  const fetchPOIs = async (query: string, color: string) => {
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    
    let radius = 15000;
    if (zoom > 15) radius = 2000;
    else if (zoom > 13) radius = 5000;
    else if (zoom > 11) radius = 10000;

    const url = `https://api.tomtom.com/search/2/poiSearch/${encodeURIComponent(query)}.json?lat=${center.lat}&lon=${center.lng}&radius=${radius}&limit=20&key=VYQttWPbFY4nVHGVQ3OtqYyox20riwIo`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const sortedPlaces = data.results
        .filter((place: any) => {
          const isRelevant = place.poi?.categories?.some((cat: string) => {
            const category = cat.toLowerCase();
            const searchTerm = query.toLowerCase();
            
            switch (query) {
              case 'adventure park':
                return category.includes('amusement') || category.includes('park');
              case 'park':
                return category.includes('park') && !category.includes('parking');
              case 'museum':
                return category.includes('museum') || category.includes('gallery');
              case 'art gallery':
                return category.includes('gallery') || category.includes('art');
              case 'restaurant':
                return category.includes('restaurant') || category.includes('food');
              case 'historical monument':
                return category.includes('historical') || 
                       category.includes('monument') || 
                       category.includes('heritage') ||
                       category.includes('fort') ||
                       category.includes('palace') ||
                       category.includes('archaeological');
              case 'temple':
                return category.includes('temple') || category.includes('religious');
              default:
                return category.includes(searchTerm);
            }
          });

          const hasName = place.poi?.name;
          const hasAddress = place.address?.freeformAddress;

          return isRelevant && hasName && hasAddress;
        })
        .sort((a: any, b: any) => {
          const aScore = (a.poi?.classifications?.length || 0) + 
                        (a.poi?.brands?.length || 0) + 
                        (a.poi?.categories?.length || 0);
          const bScore = (b.poi?.classifications?.length || 0) + 
                        (b.poi?.brands?.length || 0) + 
                        (b.poi?.categories?.length || 0);
          return bScore - aScore;
        });

      const finalPlaces = sortedPlaces.length > 8 ? sortedPlaces.slice(0, 8) : sortedPlaces;

      const newMarkers: tt.Marker[] = [];
      finalPlaces.forEach((place: any) => {
        const coords = place.position;
        const name = place.poi?.name || 'Unnamed';
        const address = place.address?.freeformAddress || '';
        const phone = place.poi?.phone || 'Not available';
        const website = place.poi?.url || '';
        const categories = place.poi?.categories || [];
        const category = categories[0] || 'Not specified';
        const classifications = place.poi?.classifications || [];
        const popularity = classifications.some((c: any) => c.code === 'POPULAR') ? 'Popular' : 'Standard';
        
        const marker = new tt.Marker({
          color: color,
          width: '30px',
          height: '30px'
        })
          .setLngLat([coords.lon, coords.lat])
          .setPopup(new tt.Popup({ 
            offset: 30,
            maxWidth: '300px',
            className: 'custom-popup'
          }).setHTML(`
            <div style="background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 style="font-size: 1.125rem; font-weight: bold; color: #1a202c;">${name}</h3>
                <span style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: white; border-radius: 0.25rem; background-color: ${color}">
                  ${category}
                </span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <p style="font-size: 0.875rem; color: #4a5568;">
                  <span style="font-weight: 600;">Address:</span> ${address}
                </p>
                <p style="font-size: 0.875rem; color: #4a5568;">
                  <span style="font-weight: 600;">Phone:</span> ${phone}
                </p>
                <p style="font-size: 0.875rem; color: #4a5568;">
                  <span style="font-weight: 600;">Popularity:</span> ${popularity}
                </p>
                ${website ? `
                  <p style="font-size: 0.875rem; color: #4a5568;">
                    <span style="font-weight: 600;">Website:</span> 
                    <a href="${website}" target="_blank" style="color: #4299e1; text-decoration: underline;">
                      Visit Website
                    </a>
                  </p>
                ` : ''}
                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
                  <p style="font-size: 0.75rem; color: #718096;">
                    Click on the marker again to close this popup
                  </p>
                </div>
              </div>
            </div>
          `))
          .addTo(map);
        
        newMarkers.push(marker);
      });

      setMarkersByQuery(prev => ({
        ...prev,
        [query]: newMarkers
      }));
    } catch (error) {
      console.error('Error fetching POIs:', error);
    }
  };

  // Update markers when selection or map view changes
  useEffect(() => {
    if (!map) return;

    const updateMarkers = () => {
      Object.keys(markersByQuery).forEach(query => {
        if (!selectedQueries.includes(query)) {
          clearMarkersForQuery(query);
        }
      });

      selectedQueries.forEach(query => {
        if (!markersByQuery[query]) {
          const category = categories.find(cat => cat.query === query);
          if (category) {
            fetchPOIs(category.query, category.color);
          }
        }
      });
    };

    map.on('moveend', updateMarkers);
    updateMarkers();

    return () => {
      map.off('moveend', updateMarkers);
    };
  }, [map, selectedQueries]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '25%', backgroundColor: '#f7fafc', padding: '1rem', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Categories</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories.map((category) => (
            <button
              key={category.query}
              onClick={() => handleTagClick(category.query)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: selectedQueries.includes(category.query) ? '#4299e1' : 'white',
                color: selectedQueries.includes(category.query) ? 'white' : 'black',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  borderRadius: '50%', 
                  marginRight: '0.5rem',
                  backgroundColor: category.color 
                }} 
              />
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div id="map" style={{ width: '75%', height: '100%' }}></div>
    </div>
  );
};

export default MapView; 