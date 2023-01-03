import React from 'react'
import ProgressBar from './ProgressBar'

export default function Stats({ category, value, count }) {
    return (
        <div className='align-center'>
            {/* <ProgressBar value={value} /> */}
            <div className='flex-column' >
                <h4>{category}</h4>

                <small style={{color: count > 0 ?  'red' : 'green'}}>{count} {count === 1 ? 'alert' : 'alerts'}</small>
            </div>
        </div>
    )
}
