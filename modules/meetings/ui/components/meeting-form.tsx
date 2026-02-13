"use client";

import { useForm } from "react-hook-form";
import { meetingInsertSchema } from "../../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMeetingAction } from "../../server/actions";
import { fetchAgents } from "@/modules/agents/server/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition, useCallback } from "react";

interface MeetingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const MeetingForm = ({ onSuccess, onCancel }: MeetingFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isSelectingAgent, setIsSelectingAgent] = useState(false);
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

  const loadAgents = useCallback(() => {
    setIsLoadingAgents(true);
    fetchAgents({ pageSize: 100 })
      .then((res) => setAgents(res.items))
      .catch(() => toast.error("Failed to load agents"))
      .finally(() => setIsLoadingAgents(false));
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: "",
      agentId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
    startTransition(async () => {
      try {
        const createdMeeting = await createMeetingAction(values);
        onSuccess?.();
        router.push(`/meetings/${createdMeeting.id}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    });
  };

  const selectedAgent = agents.find(
    (agent) => agent.id === form.watch("agentId"),
  );

  return (
    <>
    <CommandResponsiveDialog
      open={isSelectingAgent}
      onOpenChange={setIsSelectingAgent}
      title="Select Agent"
      description="Search for an agent to assign to this meeting"
    >
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No agents found.</CommandEmpty>
        <CommandGroup>
          {agents.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => {
                form.setValue("agentId", agent.id, {
                  shouldValidate: true,
                });
                setIsSelectingAgent(false);
              }}
            >
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-6"
              />
              <span>{agent.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math Consultations" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="agentId"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled={isLoadingAgents}
                  onClick={() => setIsSelectingAgent(true)}
                >
                  {selectedAgent ? (
                    <div className="flex items-center gap-x-2">
                      <GeneratedAvatar
                        seed={selectedAgent.name}
                        variant="botttsNeutral"
                        className="size-6"
                      />
                      <span>{selectedAgent.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {isLoadingAgents
                        ? "Loading agents..."
                        : "Select an agent"}
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Not found what you&apos;re looking for?{" "}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80"
                  onClick={() => setOpenNewAgentDialog(true)}
                >
                  Create new agent
                </button>
              </p>
            </FormItem>
          )}
        />
        <NewAgentDialog
          open={openNewAgentDialog}
          onOpenChange={(open) => {
            setOpenNewAgentDialog(open);
            if (!open) {
              loadAgents();
            }
          }}
        />
        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button disabled={isPending} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Form>
    </>
  );
};
