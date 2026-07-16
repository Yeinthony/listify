import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/api/queryKeys";
import { searchUsers } from "@/api/user.api";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

export const useSearchUsers = (term: string, enabled = true) => {
  const [debounced, setDebounced] = useState(term.trim());

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [term]);

  const active = enabled && debounced.length >= MIN_CHARS;

  const query = useQuery({
    queryKey: userKeys.search(debounced),
    queryFn: () => searchUsers(debounced).then((res) => res.data),
    enabled: active,
  });

  return {
    results: query.data ?? [],
    isLoading: query.isLoading && active,
    enabled: active,
  };
};
