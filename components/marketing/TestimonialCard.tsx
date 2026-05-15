import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

export default function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="card card--static rounded-md">
      <div className="card__body">
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
          ))}
        </div>
        <p className="card__text italic mb-4">&ldquo;{quote}&rdquo;</p>
        <p className="font-mono text-sm text-[#D4006A]">&mdash; {author}</p>
      </div>
    </div>
  );
}
