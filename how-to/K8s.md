# Kubernetes starting project

We strongly suggest you to use [k9s](https://k9scli.io/) to view and act on your kubernetes cluster.

## Dependencies

- [cert-manager.io/v1](https://cert-manager.io/docs/installation/helm/)
- [trust manager](https://cert-manager.io/docs/projects/trust-manager/#installation)
- install the CSI driver CRD :
```sh
kubectl apply -f certs/csi-driver.yml -n cert-manager
```
- [jaeger](https://www.jaegertracing.io/docs/1.45/operator/)
```sh
  kubectl create namespace observability
  kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.44.0/jaeger-operator.yaml -n observability
```
## BDD

### Mongo
Install the mongo release with helm
```sh
helm install my-release oci://registry-1.docker.io/bitnamicharts/mongodb
```

Then read the output to extract the root password, and update the config.properties accordingly.

### MariaDB
Install the mariadb release
```sh
helm install my-release oci://registry-1.docker.io/bitnamicharts/mariadb
```

Then read the output to extract the root password, and update the config.properties accordingly.

Mysql requires an extra step, migrating the schemes. There will be 3 steps to do so :
- Enable mariadb instance port forward in k8s. The cluster network is isolated, so to access the pod from the outside we need to do a port forward. 
```sh
kubectl get pods
# Get the mariadb pod name

kubectl port-forward $MARIADB_POD_NAME 3306
```
- Put the correct url (mysql://root:$ROOT_PW@localhost:3306/{auth|user}) in the .env of the auth and user api folder
- Run the prisma migrate dev command for both apis

## Apply the deployments

- Create grpc-tm namespace
```sh
kubectl create namespace grpc-tm
```
- Apply the deployments
```sh
kubectl apply -k base/dev
```

You should have access to the fully featured app by navigating to http://localhost

## Dashboard

Kubernetes offers a [UI](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) to visualize easily what is happening inside the cluser. Let's install it :
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

Then apply the admin user CRD to enable token generation. Be careful, this user will have admin privileges so do not do this in production.
```sh
kubectl apply -f dashboard/admin-user.yml
```

Use this command to generate a token :
```sh
kubectl -n kubernetes-dashboard create token admin-user
```
Save it so you can put it in the UI later.

And lastly the dashboard port forwarding :
```sh
kubectl port-forward deployment/kubernetes-dashboard 8443 -n kubernetes-dashboard
```

Your dashboard is now accessible at https://localhost:8443