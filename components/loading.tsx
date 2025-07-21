export const Loading = () => {
  return (
    <div className='loading-overlay'>
      <div className='loading-container p-4 text-center'>
        {Array(3)
          .fill('💪')
          .map((item, i) => {
            return (
              <span
                key={i}
                className='loading-emoji'
                aria-label='emoji de bíceps'
              >
                {item}
              </span>
            )
          })}
      </div>
    </div>
  )
}
