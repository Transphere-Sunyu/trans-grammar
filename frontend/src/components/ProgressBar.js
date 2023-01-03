import React from 'react'

export default function ProgressBar({value}) {
  return (
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style={{"--value":value}}></div>  )
}
