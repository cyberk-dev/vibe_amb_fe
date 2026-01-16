import { Header, Footer } from "@/widgets/layout";
import { AuthFormContainer } from "./_containers/auth-form-container";

const AuthDemoPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <AuthFormContainer />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthDemoPage;
