import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useAuth } from "@/contexts/AuthContext";

interface Persona {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
}

export const DiscoverPeopleDrawer = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Persona[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Persona[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredMembers(
        members.filter(
          (member) =>
            member.display_name.toLowerCase().includes(query) ||
            member.bio?.toLowerCase().includes(query) ||
            member.headline?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("personas")
        .select("id, user_id, display_name, avatar_url, bio, headline")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Users className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Discover People</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(85vh-120px)] px-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No members found" : "No members yet"}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-card border hover:bg-accent/50 transition-colors"
                >
                  <Link to={`/community/profile/${member.id}`} onClick={() => setOpen(false)}>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar_url || ""} alt={member.display_name} />
                      <AvatarFallback>{member.display_name[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/community/profile/${member.id}`}
                      onClick={() => setOpen(false)}
                      className="font-semibold hover:underline block truncate"
                    >
                      {member.display_name}
                    </Link>
                    {member.headline && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{member.headline}</p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{member.bio}</p>
                    )}
                  </div>
                  {user && member.user_id !== user.id && (
                    <FollowButton targetUserId={member.user_id} variant="outline" size="sm" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
