import React, { useState, useCallback } from 'react';
import { Heart, ChevronDown, ChevronRight } from 'lucide-react';

// Types
interface TravelComment {
  id: number;
  username: string;
  text: string;
  likes: number;
  time: string;
}

interface TravelPlace {
  place: string;
  comments: TravelComment[];
}

type TravelDataType = {
  [key: string]: TravelPlace[];
};

// Data
const travelTags = ["Adventure", "Nature", "Historical", "Local Cuisine", "Shopping"];

const travelData: TravelDataType = {
  Adventure: [
    {
      place: "River Rafting Camp",
      comments: [
        { 
          id: 1, 
          username: "adventure_seeker",
          text: "Thrilling experience! The rapids were incredible.", 
          likes: 45,
          time: "2d"
        },
        { 
          id: 2, 
          username: "travel_buddy",
          text: "Must try with friends. Best during monsoon season.", 
          likes: 32,
          time: "1d"
        },
      ],
    },
    {
      place: "Mountain Trek",
      comments: [
        { 
          id: 3, 
          username: "mountain_lover",
          text: "Breathtaking views from the summit. Worth every step!", 
          likes: 56,
          time: "5h"
        },
      ],
    },
  ],
  Nature: [
    {
      place: "Secret Waterfall",
      comments: [
        { 
          id: 4, 
          username: "nature_explorer",
          text: "A true hidden paradise! Not many tourists know about this spot.", 
          likes: 89,
          time: "1d"
        },
      ],
    },
  ],
  Historical: [
    {
      place: "Ancient Temple Ruins",
      comments: [
        { 
          id: 5, 
          username: "history_buff",
          text: "The architecture is mind-blowing! Must visit early morning.", 
          likes: 67,
          time: "4h"
        },
      ],
    },
  ],
  "Local Cuisine": [
    {
      place: "Spice Street",
      comments: [
        { 
          id: 6, 
          username: "foodie_explorer",
          text: "Hidden gem! The local spices are amazing.", 
          likes: 72,
          time: "6h"
        },
      ],
    },
  ],
  Shopping: [
    {
      place: "Artisan Market",
      comments: [
        { 
          id: 7, 
          username: "craft_lover",
          text: "Found amazing handmade jewelry at reasonable prices!", 
          likes: 52,
          time: "1d"
        },
      ],
    },
  ],
};

// Main Component
export default function TravelComments() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [localData, setLocalData] = useState<TravelDataType>(travelData);

  const handleLikeComment = useCallback((commentId: number) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handlePostComment = useCallback(() => {
    if (!newComment.trim() || !selectedTag || !selectedPlace) return;

    const allCommentIds = Object.values(localData).flatMap(places => 
      places.flatMap(place => place.comments.map(c => c.id))
    );
    const newId = allCommentIds.length > 0 ? Math.max(...allCommentIds) + 1 : 1;

    const newCommentObj: TravelComment = {
      id: newId,
      username: `user_${Math.floor(Math.random() * 1000)}`,
      text: newComment,
      likes: 0,
      time: 'now'
    };

    setLocalData(prev => {
      const newData = { ...prev };
      const placeData = newData[selectedTag]?.find(p => p.place === selectedPlace);
      if (placeData) {
        placeData.comments = [...placeData.comments, newCommentObj];
      }
      return newData;
    });

    setNewComment('');
  }, [newComment, selectedTag, selectedPlace, localData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePostComment();
    }
  }, [handlePostComment]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Tags and Places Sidebar */}
      <div style={{
        width: '320px',
        borderRight: '1px solid #f3f4f6',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#111827'
        }}>Categories</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {travelTags.map((tag) => (
            <div key={tag} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => {
                  setSelectedTag(selectedTag === tag ? null : tag);
                  setSelectedPlace(null);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                  backgroundColor: selectedTag === tag ? '#f3f4f6' : 'transparent',
                  color: selectedTag === tag ? '#2563eb' : '#374151',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedTag === tag ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span style={{ fontWeight: 500 }}>{tag}</span>
              </button>
              
              {selectedTag === tag && localData[tag]?.map((placeData: TravelPlace) => (
                <button
                  key={placeData.place}
                  onClick={() => setSelectedPlace(placeData.place)}
                  style={{
                    width: '100%',
                    padding: '6px 8px 6px 32px',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                    borderRadius: '4px',
                    backgroundColor: selectedPlace === placeData.place ? '#e5e7eb' : 'transparent',
                    color: selectedPlace === placeData.place ? '#2563eb' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {placeData.place}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div style={{
        flex: 1,
        maxWidth: '768px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {selectedTag && selectedPlace ? (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111827'
              }}>{selectedPlace}</h1>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>{selectedTag}</p>
            </div>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {localData[selectedTag]
                ?.find((p: TravelPlace) => p.place === selectedPlace)
                ?.comments.map((comment: TravelComment) => (
                  <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                    {/* User Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img
                        src={`https://i.pravatar.cc/150?u=${comment.id}`}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Comment Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{
                          fontWeight: 600,
                          color: '#111827'
                        }}>
                          {comment.username}
                        </span>{' '}
                        <span style={{ color: '#111827' }}>{comment.text}</span>
                      </div>

                      {/* Comment Actions */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '8px',
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        <span>{comment.time}</span>
                        <button 
                          onClick={() => handleLikeComment(comment.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: likedComments.has(comment.id) ? '#dc2626' : '#6b7280'
                          }}
                        >
                          <Heart size={14} fill={likedComments.has(comment.id) ? '#dc2626' : 'none'} />
                          <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Comment */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handlePostComment}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Post
              </button>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6b7280'
          }}>
            Select a category and place to view comments
          </div>
        )}
      </div>
    </div>
  );
} 