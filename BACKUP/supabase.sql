-- SUPABASE VECTOR DB COMMANDS
-- Everything was generated using this tutorial: https://supabase.com/blog/openai-embeddings-postgres-vector
-- Remember to put the NEXT_SUPABASE_KEY and NEXT_SUPABASE_URL in .env

-- Enable vector extension
create extension vector;

-- Create table documents
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1024), -- same as the embedding dimensions length
  llmsessionid int
);

-- Simple search function
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1024),
  match_threshold float,
  match_count int,
  input_llmsessionid int
)
RETURNS TABLE (
  id bigint,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
SELECT
  d.id,
  d.content,
  (1 - (d.embedding <=> query_embedding)) AS similarity
FROM
  documents d
WHERE
  (d.embedding <=> query_embedding) <= match_threshold
  AND d.llmsessionid = input_llmsessionid
ORDER BY similarity DESC
LIMIT match_count;
$$;

-- Index for distance operators
create index on documents using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);

