const EmptyState = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-[200px] h-[200px]">
        <img
          src={`https://icons.veryicon.com/png/o/miscellaneous/contribution/empty-box-1.png`}
          alt="no product"
          height={0}
          width={0}
          className="w-full h-full object-cover"
        ></img>
      </div>
      <h2 className="text-2xl">This user does not have any product</h2>
    </div>
  );
};
export default EmptyState;
