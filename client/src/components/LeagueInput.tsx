import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const leagueSchema = z.object({
  leagueId: z.string().min(1, "League ID is required").regex(/^\d+$/, "Must be a valid league ID")
});

interface LeagueInputProps {
  onSubmit: (leagueId: string) => void;
}

export default function LeagueInput({ onSubmit }: LeagueInputProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof leagueSchema>>({
    resolver: zodResolver(leagueSchema),
    defaultValues: {
      leagueId: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof leagueSchema>) => {
    onSubmit(values.leagueId);
    toast({
      title: "League loaded",
      description: `Viewing league ${values.leagueId}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="leagueId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Enter FPL League ID" 
                  className="bg-white/20 text-white placeholder:text-white/60"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Load League
        </Button>
      </form>
    </Form>
  );
}
