import React from 'react' 

export enum WindowButtonColour {
  Red = 'bg-[#ff5250]',
  Yellow = 'bg-[#ffbc00]',
  Green = 'bg-[#00cd1c]',
}

const MockWindowButton = ({colour}: {colour: WindowButtonColour}) => (
  <div className={`${colour} rounded-full h-5 w-5`}></div>
)

export default MockWindowButton
