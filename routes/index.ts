import { Router } from "express";

// Import our other routes
import mapRoutes from "./map.routes";
import usersRoutes from "./users.routes";
import imagesRoutes from "./images.routes";
import adminRoutes from "./admin.routes";

const apiRouter: Router = Router();

// add the API routes
apiRouter.use('/map', mapRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/images', imagesRoutes);
apiRouter.use('/admin',adminRoutes);

export default apiRouter;