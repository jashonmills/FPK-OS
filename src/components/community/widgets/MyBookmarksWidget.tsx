import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BookmarkedPost {
  id: string;
  post_id: string;
  created_at: string;
  posts: {
    id: string;
    content: string;
    created_at: string;
    author_id: string;
    personas: {
      display_name: string;
    } | { display_name: string }[];
  };
}

export const MyBookmarksWidget = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          id,
          post_id,
          created_at,
          posts (
            id,
            content,
            created_at,
            author_id,
            personas (
              display_name
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WidgetCard title="My Bookmarks" icon={<Bookmark className="h-4 w-4" />}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </WidgetCard>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <WidgetCard title="My Bookmarks" icon={<Bookmark className="h-4 w-4" />}>
        <p className="text-sm text-muted-foreground">
          No bookmarks yet. Click the bookmark icon on posts to save them here.
        </p>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard title="My Bookmarks" icon={<Bookmark className="h-4 w-4" />}>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <p className="text-sm line-clamp-2 mb-2">{bookmark.posts.content}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Link
                to={`/community/profile/${bookmark.posts.author_id}`}
                className="hover:underline"
              >
                by {Array.isArray(bookmark.posts.personas) 
                  ? bookmark.posts.personas[0]?.display_name 
                  : bookmark.posts.personas.display_name}
              </Link>
              <span>
                {formatDistanceToNow(new Date(bookmark.posts.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};
