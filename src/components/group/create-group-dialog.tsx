"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
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
import { PlusIcon } from "lucide-react";
import { createGroup } from "@/features/groups/actions/create-group";

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createGroup, undefined);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state?.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group to collaborate with other students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {state?.message && !state.success && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {state.message}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter group name"
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-red-600">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your group's purpose"
                rows={3}
              />
              {state?.errors?.description && (
                <p className="text-sm text-red-600">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
