'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CreateDiaryEntryRequest, DiaryEntry, UpdateDiaryEntryRequest } from '@/types/diary'

const diaryEntrySchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(5000, 'Conteúdo deve ter no máximo 5000 caracteres'),
})

type DiaryEntryFormData = z.infer<typeof diaryEntrySchema>

interface DiaryEntryFormProps {
  entry?: DiaryEntry
  onSubmit: (data: CreateDiaryEntryRequest) => void
  onUpdate?: (data: UpdateDiaryEntryRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function DiaryEntryForm({ entry, onSubmit, onUpdate, onCancel, isLoading }: DiaryEntryFormProps) {
  const form = useForm<DiaryEntryFormData>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      date: entry?.date || new Date().toISOString().split('T')[0],
      title: entry?.title || '',
      content: entry?.content || '',
    },
  })

  const handleSubmit = (data: DiaryEntryFormData) => {
    if (entry && onUpdate) {
      // Editing mode - only send title and content
      onUpdate({ title: data.title, content: data.content })
    } else {
      // Creating mode - send all data
      onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!entry && (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite um título para sua entrada..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva sobre as atividades do dia, reflexões, insights..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : entry ? 'Atualizar' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}