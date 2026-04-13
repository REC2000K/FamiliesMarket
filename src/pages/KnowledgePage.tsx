import { useState, useMemo } from 'react';
import { Search, BookOpen, Calendar, Tag, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Article } from '@/types';

export function KnowledgePage() {
  const { articles } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.summary.toLowerCase().includes(searchLower) ||
          a.content.toLowerCase().includes(searchLower) ||
          a.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [articles, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            База знаний
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Статьи, руководства и полезные материалы по работе с Revit и созданию семейств.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по статьям..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Найдено: <span className="font-medium">{filteredArticles.length}</span> статей
          </p>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {article.category}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {article.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Статьи не найдены
            </h3>
            <p className="text-gray-600 mb-4">
              Попробуйте изменить параметры поиска
            </p>
            <Button onClick={() => { setSearch(''); setSelectedCategory('all'); }}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>

      {/* Article Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedArticle.category}</Badge>
                  <span className="text-gray-500">
                    {new Date(selectedArticle.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedArticle.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
