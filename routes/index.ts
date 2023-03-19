import { Router } from "express";

// Import our other routes
import mapRoutes from "./map.routes";
import usersRoutes from "./users.routes";
import imagesRoutes from "./images.routes";
import adminRoutes from "./admin.routes";
import scrapRoutes from "./scrapbook.routes";

// Create a new router
const apiRouter: Router = Router();

// Use our other routes
apiRouter.use('/map', mapRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/images', imagesRoutes);
apiRouter.use('/admin',adminRoutes);
apiRouter.use('/scrap', scrapRoutes)

export default apiRouter;