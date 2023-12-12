import React, { useState } from 'react';

const DateRangeComponent = ({handleStartDateChange,handleEndDateChange,dateRange,DateDisabled}) => {
  return (
    <div>
      <label>Start Date:</label>
      <input className='dates' disabled={DateDisabled()}
        type="date"
        value={dateRange.startDate}
        onChange={handleStartDateChange}
      />

      <label>End Date:</label>
      <input className='dates' disabled={DateDisabled()}
        type="date"
        value={dateRange.endDate}
        onChange={handleEndDateChange}
      />
    </div>
  );
};

export default DateRangeComponent;
