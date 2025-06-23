import "module-alias/register";
import _ from "./types/global";

import { spawnSync } from "child_process";
import { env, runtime } from "@/lib/utils";

(async () => {
   const entry = `./src/server/socket.${runtime}.ts`;

   if (env.MODE !== "prod") return await import(entry);

   const controller = new AbortController(),
      { signal } = controller,
      outdir = "./dist";
   spawnSync(
      "bun",
      [
         "build",
         entry,
         "--target=bun",
         "--minify",
         "--sourcemap",
         `--outdir ${outdir}`,
      ],
      { stdio: "inherit", shell: true, signal, env }
   );
})();
