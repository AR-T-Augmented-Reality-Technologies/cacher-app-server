import { Router } from "express";

// Import our other routes
import mapRoutes from "./map.routes";
import usersRoutes from "./users.routes";

const apiRouter: Router = Router();

// add the API routes
apiRouter.use('/map', mapRoutes);
apiRouter.use('/users', usersRoutes);

export default apiRouter;