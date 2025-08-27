import { AuthDemoContainer } from "./_components/auth-demo-container";

const AuthDemoPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Authentication Demo</h1>
        <p className="text-gray-600">
          Demonstration of auth store patterns with Zustand and form handling
        </p>
      </div>
      <AuthDemoContainer />
    </div>
  );
};

export default AuthDemoPage;