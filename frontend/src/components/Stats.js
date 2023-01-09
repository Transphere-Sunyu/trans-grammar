import { Flex } from '@chakra-ui/react'
import React from 'react'
import ProgressBar from './ProgressBar'

export default function Stats({ titleColor , category, value, count , icon , desc}) {
    return (
        <Flex w={'100%'} className='align-center'>
            {/* <ProgressBar value={value} /> */}
            { icon && icon }
            <div className='flex-column' >
                <h4 style={{color: titleColor}}>{category}</h4>

                <small style={{color: '#A9A5A5'}}>{desc}</small>

            </div>
        </Flex>
    )
}
