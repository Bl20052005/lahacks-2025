import Layer from "@/components/layer";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="mb-4">
        You are logged in. Use the navigation bar to access forms or log out.
      </p>
      <Layer />
    </div>
  );
}
