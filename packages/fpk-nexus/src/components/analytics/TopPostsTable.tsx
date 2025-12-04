import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TopPostsTableProps {
  posts: Array<{ id: string; created_at: string; content: string; image_url?: string | null }>;
  supports: Array<{ post_id: string }>;
  comments: Array<{ post_id: string }>;
}

export default function TopPostsTable({ posts, supports, comments }: TopPostsTableProps) {
  const topPosts = useMemo(() => {
    const postEngagement = posts.map(post => {
      const supportCount = supports.filter(s => s.post_id === post.id).length;
      const commentCount = comments.filter(c => c.post_id === post.id).length;
      const totalEngagement = supportCount + commentCount * 2; // Weight comments more

      return {
        ...post,
        supportCount,
        commentCount,
        totalEngagement,
      };
    });

    return postEngagement
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 5);
  }, [posts, supports, comments]);

  if (topPosts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No posts yet in this time period
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead className="text-center">
              <Heart className="h-4 w-4 inline" />
            </TableHead>
            <TableHead className="text-center">
              <MessageSquare className="h-4 w-4 inline" />
            </TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="max-w-md">
                <div className="flex items-start gap-3">
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt=""
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <p className="text-sm line-clamp-2 text-foreground">
                    {post.content}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                {post.supportCount}
              </TableCell>
              <TableCell className="text-center font-medium">
                {post.commentCount}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
