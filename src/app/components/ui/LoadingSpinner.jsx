export default function LoadingSpinner() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <img
        src='/Spinner.gif'
        alt='Loading...'
        className='w-15 h-15 sm:w-10 sm:h-10 lg:w-20 lg:h-20'
      />
    </div>
  );
}
