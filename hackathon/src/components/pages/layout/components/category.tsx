"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { categories } from "@/types/category";
import { UseFormReturn,  ControllerRenderProps } from "react-hook-form";

interface FormValues {
  content: string;
  isProductListing: boolean;
  name?: string;
  category?: string;
  condition?: string;
  price?: number;
  description?: string;
  stock?: number;
}

interface CategorySelectProps {
  form: UseFormReturn<FormValues>;
}

const CategorySelect = ({ form }: CategorySelectProps) => {
  const [category1, setCategory1] = useState<string>("");
  const [category2, setCategory2] = useState<string>("");

  // カテゴリ1変更時の処理
  const handleCategory1Change = (value: string, field: ControllerRenderProps<FormValues, "category">) => {
    setCategory1(value);
    setCategory2(""); // サブカテゴリをリセット
    field.onChange(""); // フォームの値をリセット
  };

  // サブカテゴリ変更時の処理
  const handleCategory2Change = (value: string, field: ControllerRenderProps<FormValues, "category">) => {
    setCategory2(value);
    field.onChange(`${category1} > ${value}`); // フォームの値に反映
  };

  // リセット処理
  const resetCategories = (field: ControllerRenderProps<FormValues, "category">) => {
    setCategory1("");
    setCategory2("");
    field.onChange(""); // フォームの値をリセット
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>カテゴリ</FormLabel>
          {/* カテゴリ1 */}
          <Select value={category1} onValueChange={(value) => handleCategory1Change(value, field)}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* サブカテゴリ */}
          {category1 && (
            <Select value={category2} onValueChange={(value) => handleCategory2Change(value, field)}>
              <SelectTrigger>
                <SelectValue placeholder="サブカテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {categories[category1].map((subCategory) => (
                  <SelectItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* 選択されたカテゴリの表示 */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              選択されたカテゴリ:
              {field.value && <span className="ml-2 text-blue-600">{field.value}</span>}
            </p>
            {(category1 || category2) && (
              <Button variant="outline" size="sm" onClick={() => resetCategories(field)}>
                リセット
              </Button>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorySelect;