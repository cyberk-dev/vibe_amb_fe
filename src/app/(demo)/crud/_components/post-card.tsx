import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Edit, User, Calendar } from "lucide-react";
import { type Post } from "@/api/posts";

interface PostCardProps {
  post: Post;
  isDeleting: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editComponent?: React.ReactNode;
}

export const PostCard = ({
  post,
  isDeleting,
  isEditing,
  onEdit,
  onDelete,
  editComponent,
}: PostCardProps) => {
  return (
    <Card className="relative">
      {isDeleting && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Deleting...</div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          editComponent
        ) : (
          <CardDescription className="text-foreground whitespace-pre-wrap">
            {post.content}
          </CardDescription>
        )}

        {post.createdAt !== post.updatedAt && !isEditing && (
          <div className="mt-3 pt-3 border-t">
            <Badge variant="secondary" className="text-xs">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
