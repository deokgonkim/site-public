---
category:
  - DevTool
install-method:
  - apt
  - deb
tags:
  - Development
---
- URL: https://dbeaver.io/
### Install

```shell
sudo wget -q -O - https://dbeaver.io/debs/dbeaver.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/dbeaver.gpg.key
echo "deb [signed-by=/usr/share/keyrings/dbeaver.gpg.key] https://dbeaver.io/debs/dbeaver-ce /" | sudo tee /etc/apt/sources.list.d/dbeaver.list
sudo apt-get update && sudo apt-get install dbeaver-ce
```
or
```shell
dpkg -i dbeaver-ce-26.0.1-linux-x86_64
```
