import { Clock, User } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ArticleCardProps {
  title: string;
  abstract: string;
  author: string;
  category: string;
  readTime: string;
  imageUrl: string;
  pdfUrl?: string;
  featured?: boolean;
}

export function ArticleCard({
  title,
  abstract,
  author,
  category,
  readTime,
  imageUrl,
  pdfUrl,
  featured = false,
}: ArticleCardProps) {
  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-lg ${
      featured ? "md:col-span-2 md:row-span-2" : ""
    }`}>
      <div className={`flex ${featured ? "flex-col md:flex-row" : "flex-col"} h-full`}>
        {/* Image */}
        <div className={`relative overflow-hidden bg-muted ${
          featured ? "md:w-1/2" : "h-48"
        }`}>
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge>{category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 flex flex-col ${featured ? "md:w-1/2" : ""}`}>
          <h3 className={`mb-3 line-clamp-2 transition-colors group-hover:text-primary ${
            featured ? "text-xl lg:text-2xl" : ""
          }`}>
            {pdfUrl ? (
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          
          <p className={`text-muted-foreground mb-4 flex-grow ${
            featured ? "line-clamp-4" : "line-clamp-3"
          }`}>
            {abstract}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
