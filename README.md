![](imgs/image.png)

# CityPatterns

**Description**: The incessant energy of the city is transformed into aleatoric movement covering the extruded and tessellated forms of crowdsourced OpenStreetMap data. Though the streams are chaotic, they coalesce into a kind of digital harmony. Inspired by the artist Ryoji Ikea. 

**Author**: Patricio Gonzalez Vivo (Buenos Aires, 1982) is a New York based artist and engineer. He explores interstitial spaces between organic and synthetic, analog and digital, individual and collective.

Patricio studied and practiced psychotherapy and expressive art therapy. He holds an MFA in Design & Technology from Parsons The New School, where he now teaches. Currently he works as a Graphic Engineer at Mapzen making openSource mapping tools.


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
