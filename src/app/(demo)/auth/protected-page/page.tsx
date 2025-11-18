import ProtectedPageContainer from "@/app/(demo)/auth/protected-page/_container/protected-page-container";

const ProtectedAuthDemoPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <ProtectedPageContainer />
      </main>
    </div>
  );
};

export default ProtectedAuthDemoPage;
