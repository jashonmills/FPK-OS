import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  types?: ('user' | 'page' | 'task' | 'project' | 'file')[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { query, types = ['user', 'page', 'task', 'project', 'file'] } = await req.json() as SearchRequest;

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const searchTerm = `%${query.toLowerCase()}%`;
    const results: any[] = [];

    // Search users
    if (types.includes('user')) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .or(`full_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(10);

      if (users) {
        results.push(...users.map(user => ({
          id: user.id,
          label: user.full_name || user.email,
          type: 'user',
          metadata: { email: user.email, avatar_url: user.avatar_url }
        })));
      }
    }

    // Search pages
    if (types.includes('page')) {
      const { data: pages } = await supabase
        .from('doc_pages')
        .select('id, title, space_id, doc_spaces(name)')
        .ilike('title', searchTerm)
        .limit(10);

      if (pages) {
        results.push(...pages.map((page: any) => ({
          id: page.id,
          label: page.title,
          type: 'page',
          metadata: { 
            space_name: page.doc_spaces?.name 
          }
        })));
      }
    }

    // Search tasks
    if (types.includes('task')) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, status, priority, project_id, projects(name)')
        .ilike('title', searchTerm)
        .limit(10);

      if (tasks) {
        results.push(...tasks.map((task: any) => ({
          id: task.id,
          label: task.title,
          type: 'task',
          metadata: { 
            status: task.status,
            priority: task.priority,
            project_name: task.projects?.name
          }
        })));
      }
    }

    // Search projects
    if (types.includes('project')) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description')
        .ilike('name', searchTerm)
        .limit(10);

      if (projects) {
        results.push(...projects.map(project => ({
          id: project.id,
          label: project.name,
          type: 'project',
          metadata: { description: project.description }
        })));
      }
    }

    // Search files
    if (types.includes('file')) {
      const { data: files } = await supabase
        .from('project_files')
        .select('id, name, file_type, folder_id, file_folders(name)')
        .ilike('name', searchTerm)
        .limit(10);

      if (files) {
        results.push(...files.map((file: any) => ({
          id: file.id,
          label: file.name,
          type: 'file',
          metadata: { 
            file_type: file.file_type,
            folder_name: file.file_folders?.name
          }
        })));
      }
    }

    console.log(`Search for "${query}" returned ${results.length} results`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error in search-mentions:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
