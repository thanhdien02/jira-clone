export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-red-500 text-white text-xl flex justify-center items-center min-h-[60px]">
        Header
      </div>
      <div>{children}</div>
    </>
  );
}
