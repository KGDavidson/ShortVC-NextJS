import { IconType } from 'react-icons'

const MockNavigationButton = ({arrow: Arrow}: {arrow: IconType}) => {
  return (
    <div className='bg-[#f2f2f2] h-6 w-6 rounded flex justify-center items-center'>
      <Arrow className='text-[#a7a6a7] text-2xl' />
    </div>
  )
}

export default MockNavigationButton
