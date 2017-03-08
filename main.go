// 通过rev.json配置,检查是否有不存在的文件

package main

import (
  "fmt"
  "io/ioutil"
  "encoding/json"
  "log"
  "strings"
  "os"
)

type mytype map[string]string

func main() {
  var data mytype
  file, err := ioutil.ReadFile("assets/rev-manifest.json")
  if err != nil {
    log.Fatal(err)
  }

  err = json.Unmarshal(file, &data)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println("Not found files: ")

  for path := range data {
    index := strings.Index(path, ".");
    revFile := "../../" + path[0:index] + "-" + data[path] + path[index:len(path)]

    if _, err := os.Stat(revFile); os.IsNotExist(err) {
      fmt.Println(revFile)
    }
  }
}
