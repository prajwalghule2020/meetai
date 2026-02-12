"use client";

import { useForm } from "react-hook-form";
import { agentInsertSchema, agentUpdateSchema } from "../../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentAction, updateAgentAction } from "../../server/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: {
        id: string;
        name: string;
        instructions: string;
    };
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof agentInsertSchema>>({
        resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        },
    });

    const isEdit = !!initialValues?.id;

    const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
        startTransition(async () => {
            try {
                if (isEdit && initialValues?.id) {
                    await updateAgentAction({ ...values, id: initialValues.id });
                } else {
                    await createAgentAction(values);
                }
                // Refresh to get updated data (similar to invalidateQueries)
                router.refresh();
                onSuccess?.();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Something went wrong");
                // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
            }
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16" />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Math Tutor" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with assignments." />
                            </FormControl>
                        </FormItem>
                    )} />
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
                       {isEdit? "Update" : "Create"}
                    </Button>

                </div>
            </form>
        </Form>
    )

}