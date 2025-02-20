

const useTestHook = () => {
  const handleTest = () => {
    // perform some action
    console.log("test hook new: ");
  };
  console.log("outside test hook new: ");
  return { handleTest };
};

export default useTestHook;
