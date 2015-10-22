

# Automaticaly load shaders on RaspberryPi

- After installing Raspbian, set the GPU memory to 258

- Install [GlslViewer](https://github.com/patriciogonzalezvivo/glslViewer.git) 

```bash
cd ~ 
git clone http://github.com/patriciogonzalezvivo/glslViewer
cd glslViewer
make
sudo make install
```

- Clone this repository

```bash
cd ~ 
git clone https://github.com/patriciogonzalezvivo/data-landscape.git
```

- Add ```runShader.sh``` to crontab

```bash

```

Write

```
@reboot /home/pi/data-landscape/shader/./runShader.sh
```

## To Change the shader just do

```bash
cd ~/data-landscape/shader
ln -sf ikeda-00.frag default.frag
```
