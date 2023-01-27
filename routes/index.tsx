import { Router } from "express";

// Import our other routes
import mapRoutes from "./map.routes";
import usersRouters from "./users.routes";

const apiRouter: Router = Router();

// add the API routes
apiRouter.use('/map', mapRoutes);
apiRouter.use('/users', usersRouters);

export default apiRouter;