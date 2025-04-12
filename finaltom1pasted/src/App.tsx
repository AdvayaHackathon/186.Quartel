import React, { useState } from 'react';
import MapView from './MapView';
import TravelComments from './travelcomments';
import Navbar from './components/Navbar';

const App = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'comments'>('map');

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{
        flex: 1,
        marginTop: '64px', // Height of navbar
        overflow: 'hidden'
      }}>
        {activeTab === 'map' ? <MapView /> : <TravelComments />}
      </div>
    </div>
  );
};

export default App;
