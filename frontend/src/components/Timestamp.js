import React from 'react';

const TimestampComponent = ({timestamp}) => {
    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }).format(new Date(timestamp));
    
      return (
        <div>
          Locks on {formattedTimestamp}
        </div>
      );
    };

export default TimestampComponent;





