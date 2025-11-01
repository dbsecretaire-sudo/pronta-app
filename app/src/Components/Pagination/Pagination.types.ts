export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string; // ✅ Pour personnaliser les styles
  showPageNumbers?: boolean; // ✅ Option pour masquer les numéros de page
  maxVisiblePages?: number; // ✅ Limiter le nombre de pages visibles (ex: 5)
}