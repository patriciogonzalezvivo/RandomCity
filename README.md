![](imgs/image.png)

# DataScape / Pulses / PulseScape / Procedural / fract(sin(x)*1e4) 

**Description**: Procedural landscape constructed from the aleatory outcomes of ```fract(sin(x)*1e4)```. This function produce random pulses covers the extruded and tessellated data from OpenStreetMap. Vibran and chaotic these streams of random pulses compose a cold view of a digital world inspired on the artist Ryoji Ikeda. 

About the author: Patricio Gonzalez Vivo, 


## Load sample shaders on RaspberryPi

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

- Open crontab

```bash
crontab -e
```

- Add ```runShader.sh``` to be run every reboot

```
@reboot /home/pi/data-landscape/shaders/./runShader.sh
```

### To Change the shader just do

```bash
cd ~/data-landscape/shaders
ln -sf ikeda-00.frag default.frag
```
