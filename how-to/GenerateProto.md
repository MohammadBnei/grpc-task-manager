# Generating Protobuf Stubs

In this project, there is a dedicated folder named proto that contains all the protobuf definitions. We are using [buf](https://buf.build/) to handle the IDL (Interface Definition Language) assets.

## buf.gen.yaml

This file is where the buf magic happens. You can define the usage of a plugin, options and output directory to generate the stubs into :
```yaml
version: v1
managed:
  enabled: true
plugins:
  # Here you can define the plugin, and they will generate stubs in the language of your choice
  - plugin: buf.build/community/stephenh-ts-proto
  # Specify the output directory, where the tstubs will be generated
    out: ../auth-api/src/stubs
  # Specify options for the plugins
    opt:
      - addGrpcMetadata=true
      - nestJs=true
```

The buf.gen.yaml is used by the following command :
```bash
buf generate
```

## Exporting proto files

For nestjs gRPC apis, it is needed to include the proto files in the src folder. To do that, we can use the buf export command from the proto folder  :
```bash
buf export . --output ../auth-api/src/proto
```

it will export all the proto files to the specified directory (in this case auth-api/src/proto)

## Script 

For convenience, there is a script that updates the stubs and the protobufs. It's export.sh, and it is placed again in the /proto folder.

To add your api to the list, simply add the following line to the end of the file :
```sh
buf export . --output ../$YOUR_API_FOLDER/src/proto
```

Then, you can run it like this (**from inside the proto folder !**) : 
```sh
./export.sh
```

## Steps

1. Add your plugin, output folder (out) and options in **buf.gen.yaml**
2. Add the export to your api folder in **export.sh**
3. Run **./export.sh** every time you make a change in your proto file