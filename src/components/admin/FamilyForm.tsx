import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import type { RevitFamily } from '@/types';

interface FamilyFormProps {
  family?: RevitFamily;
  onSuccess: () => void;
}

export function FamilyForm({ family, onSuccess }: FamilyFormProps) {
  const { categories, tags, addFamily, updateFamily } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: family?.name || '',
    description: family?.description || '',
    category: family?.category || '',
    tags: family?.tags.join(', ') || '',
    version: family?.version || '2020',
    fileName: family?.fileName || '',
    filePath: family?.filePath || '',
    fileSize: family?.fileSize || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const familyData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: tagsArray,
      version: formData.version,
      fileName: formData.fileName,
      filePath: formData.filePath || `/families/${formData.fileName}`,
      fileSize: formData.fileSize || '0 KB',
    };

    if (family) {
      updateFamily(family.id, familyData);
    } else {
      addFamily(familyData);
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Название *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Например: Дверь одинарная 900мм"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Описание семейства, его особенности и применение"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Категория *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Версия Revit *</Label>
          <Select
            value={formData.version}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, version: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Версия" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Теги (через запятую)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="3D, Параметрический, Стандартный"
        />
        <p className="text-xs text-gray-500">
          Доступные теги: {tags.slice(0, 5).join(', ')}...
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileName">Имя файла *</Label>
        <Input
          id="fileName"
          value={formData.fileName}
          onChange={(e) => setFormData((prev) => ({ ...prev, fileName: e.target.value }))}
          placeholder="family_name.rfa"
          required
        />
        <p className="text-xs text-gray-500">
          Укажите имя файла семейства
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filePath">Путь к файлу *</Label>
        <Input
          id="filePath"
          value={formData.filePath}
          onChange={(e) => setFormData((prev) => ({ ...prev, filePath: e.target.value }))}
          placeholder="/families/family_name.rfa"
          required
        />
        <p className="text-xs text-gray-500">
          Путь к файлу для скачивания (например: /families/door.rfa)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileSize">Размер файла</Label>
        <Input
          id="fileSize"
          value={formData.fileSize}
          onChange={(e) => setFormData((prev) => ({ ...prev, fileSize: e.target.value }))}
          placeholder="Например: 245 KB"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : family ? 'Сохранить изменения' : 'Добавить семейство'}
        </Button>
      </div>
    </form>
  );
}
