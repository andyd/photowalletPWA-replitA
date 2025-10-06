import type { Express } from "express";
import { createServer, type Server } from "http";
import { getUncachableGitHubClient } from "./github";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/github/create-repo", async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Repository name is required" });
      }

      const octokit = await getUncachableGitHubClient();
      
      const { data: user } = await octokit.users.getAuthenticated();
      
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name,
        description: description || "",
        private: isPrivate || false,
        auto_init: false,
      });

      try {
        await execAsync('git init');
        await execAsync('git add .');
        await execAsync('git commit -m "Initial commit"');
        await execAsync(`git remote add origin ${repo.clone_url}`);
        await execAsync(`git push -u origin main`);
      } catch (gitError: any) {
        console.error("Git error:", gitError);
      }

      res.json({ 
        success: true, 
        repo: {
          name: repo.name,
          url: repo.html_url,
          cloneUrl: repo.clone_url,
          owner: user.login
        }
      });
    } catch (error: any) {
      console.error("GitHub API error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to create repository" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
