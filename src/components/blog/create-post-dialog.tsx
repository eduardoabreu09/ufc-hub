"use client";

import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusIcon } from "lucide-react";
import { createPost } from "@/features/blog/actions/create-post";
import { toast } from "sonner";
import { CreatePostFormState } from "@/features/blog/form-schema/create-post";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CreatePostFormState>();
  const [isPending, startTransition] = useTransition();
  const [contentPreview, setContentPreview] = useState("");
  const [tagsValue, setTagsValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createPost(formData);
      setState(result);

      if (result.isSuccess) {
        toast.success(result.message);
        setOpen(false);
        setContentPreview("");
        setTagsValue("");
      } else if (result.message) {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-4xl md:max-w-5xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Postagem</DialogTitle>
            <DialogDescription>
              Compartilhe novidades, ideias ou informações com a comunidade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Título da postagem"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body">Resumo</Label>
              <Textarea
                id="body"
                name="body"
                placeholder="Um breve resumo do assunto (aparece na listagem)"
                rows={2}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Ex.: Tecnologia, Saúde, Networking"
                value={tagsValue}
                onChange={(e) => setTagsValue(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Conteúdo</Label>
              <p className="text-sm text-muted-foreground">
                Suporta Markdown (.md) para enriquecer o texto com formatações,
                listas e links.
              </p>
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <div className="space-y-2">
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Escreva o conteúdo completo da sua postagem aqui..."
                    rows={10}
                    className="min-h-[520px] max-h-[520px]"
                    value={contentPreview}
                    onChange={(e) => setContentPreview(e.target.value)}
                    required
                  />
                </div>

                <article
                  className="prose prose-neutral max-w-none dark:prose-invert 
                        prose-img:rounded-xl prose-a:text-primary prose-li:text-foreground
                        prose-h1:font-bold prose-h1:border-b prose-h1:border-foreground/30 prose-h1:pb-2
                        prose-h2:border-b prose-h2:border-foreground/30 prose-h2:pb-2
                        prose-pre:bg-muted prose-pre:rounded-lg prose-pre:shadow-md
                        prose-code:text-foreground border rounded-md bg-muted/40 p-3 max-h-[520px] overflow-auto"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {contentPreview ||
                      "Pré-visualização do conteúdo aparecerá aqui."}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            {isPending && (
              <Button type="submit" disabled>
                <Loader2 className=" animate-spin" /> Publicando...
              </Button>
            )}
            {!isPending && <Button type="submit">Publicar</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
