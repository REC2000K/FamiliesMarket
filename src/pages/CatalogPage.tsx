import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FamilyCard } from '@/components/ui-custom/FamilyCard';
import { useData } from '@/context/DataContext';
import type { FamilyFilters } from '@/types';

export function CatalogPage() {
  const { families, categories, tags } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FamilyFilters>({
    category: 'all',
    tags: [],
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const filteredFamilies = useMemo(() => {
    let result = [...families];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter((f) => f.category === filters.category);
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter((f) =>
        filters.tags.some((tag) => f.tags.includes(tag))
      );
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.description.toLowerCase().includes(searchLower) ||
          f.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'downloads':
          comparison = a.downloads - b.downloads;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [families, filters]);

  const activeFiltersCount =
    (filters.category && filters.category !== 'all' ? 1 : 0) + filters.tags.length + (filters.search ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      category: 'all',
      tags: [],
      search: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Каталог семейств Revit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Библиотека качественных параметрических семейств для Autodesk Revit. 
            Все семейства протестированы и готовы к использованию в ваших проектах.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по названию, описанию или тегам..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full lg:w-48">
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

            {/* Tags Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Теги
                  {filters.tags.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.tags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        tags: checked
                          ? [...prev.tags, tag]
                          : prev.tags.filter((t) => t !== tag),
                      }));
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) =>
                setFilters((prev) => ({ ...prev, sortBy: value }))
              }
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="downloads">По скачиваниям</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
                }))
              }
              title={filters.sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            {/* View Mode */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-500">Активные фильтры:</span>
              {filters.category && filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.category}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: 'all' }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((t) => t !== tag),
                      }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Сбросить все
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Найдено: <span className="font-medium">{filteredFamilies.length}</span> семейств
          </p>
        </div>

        {filteredFamilies.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredFamilies.map((family) => (
              <FamilyCard key={family.id} family={family} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Семейства не найдены
            </h3>
            <p className="text-gray-600 mb-4">
              Попробуйте изменить параметры поиска или фильтры
            </p>
            <Button onClick={clearFilters}>Сбросить фильтры</Button>
          </div>
        )}
      </div>
    </div>
  );
}
