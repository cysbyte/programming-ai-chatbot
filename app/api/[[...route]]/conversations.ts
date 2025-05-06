import { Hono } from "hono";
import { supabase } from "@/lib/supabase";

const app = new Hono()
  .get("/", (c) => c.json("list of conversations"))
  .post("/", async (c) => {
    try {
      console.log("Received POST request");
      const formData = await c.req.formData();
      const userInput = formData.get("userInput") as string;
      const images = formData.getAll("images") as string[];
      
      console.log("Form data received:", {
        userInput,
        imageCount: images.length,
        firstImagePreview: images[0]?.substring(0, 50) + "...",
      });

      if (!userInput) {
        console.error("No user input provided");
        return c.json({ error: "User input is required" }, 400);
      }

      let imageUrls: string[] = [];

      // Only process images if they are provided
      if (images.length > 0) {
        // Upload images to Supabase and get URLs
        imageUrls = await Promise.all(
          images.map(async (base64Image, index) => {
            try {
              console.log(`Processing image ${index + 1}/${images.length}`);
              
              // Convert base64 to blob
              const base64Data = base64Image.split(",")[1];
              if (!base64Data) {
                throw new Error("Invalid base64 image data");
              }
              const binaryData = Buffer.from(base64Data, "base64");
              
              // Generate unique filename
              const filename = `images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
              console.log(`Generated filename for image ${index + 1}:`, filename);
              
              // Upload to Supabase Storage
              console.log(`Uploading image ${index + 1} to Supabase...`);
              const { error } = await supabase.storage
                .from("images")
                .upload(filename, binaryData, {
                  contentType: "image/jpeg",
                });

              if (error) {
                console.error(`Error uploading image ${index + 1}:`, error);
                throw error;
              }
              console.log(`Successfully uploaded image ${index + 1}`);

              // Get public URL
              const { data: { publicUrl } } = supabase.storage
                .from("images")
                .getPublicUrl(filename);
              console.log(`Public URL for image ${index + 1}:`, publicUrl);

              return publicUrl;
            } catch (error) {
              console.error(`Error processing image ${index + 1}:`, error);
              throw error;
            }
          })
        );

        console.log("All images processed successfully. Image URLs:", imageUrls);
      }

      // Save conversation with image URLs
      console.log("Saving conversation to database...");
      const { data: conversation, error } = await supabase
        .from("conversations")
        .insert([
          {
            user_input: userInput,
            image_urls: imageUrls,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving conversation:", error);
        throw error;
      }
      console.log("Conversation saved successfully:", conversation);

      return c.json(conversation, 201);
    } catch (error) {
      console.error("Error in POST /conversations:", error);
      return c.json({ 
        error: "Failed to create conversation",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 500);
    }
  })
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;