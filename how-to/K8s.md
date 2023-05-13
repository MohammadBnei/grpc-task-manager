# Kubernetes starting project

## Dependencies

- [cert-manager.io/v1](https://cert-manager.io/docs/installation/helm/)
- [trust manager](https://cert-manager.io/docs/projects/trust-manager/#installation)
- [jaeger](https://www.jaegertracing.io/docs/1.45/operator/)
```sh
  kubectl create namespace observability
  kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.44.0/jaeger-operator.yaml -n observability
```

## Steps 

- Create grpc-tm namespace
```sh
kubectl create namespace grpc-tm
```
- install the CSI driver CRD :
```sh
kubectl apply -f certs/csi-driver.yml
```