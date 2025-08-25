import { CreatePostFormContainer } from "./_components/create-post-form-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostsListContainer } from "./_components/posts-list-container";

const CrudDemoPage = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Posts CRUD Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of React Query with CRUD operations, optimistic updates,
          and error handling
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Post Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Add a new post with optimistic updates and error handling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePostFormContainer />
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              View, edit, and delete posts with real-time updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostsListContainer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrudDemoPage;
